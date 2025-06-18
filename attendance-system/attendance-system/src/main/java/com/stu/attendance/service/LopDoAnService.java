package com.stu.attendance.service;

import com.stu.attendance.dto.LopDoAnDTO;
import com.stu.attendance.dto.SessionDto;
import com.stu.attendance.entity.BuoiHoc;
import com.stu.attendance.entity.LopDoAn;
import com.stu.attendance.repository.LopDoAnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LopDoAnService {
    @Autowired
    private final LopDoAnRepository lopDoAnRepository;

    @Transactional
    public LopDoAnDTO addLopDoAn(LopDoAnDTO lopDoAnDTO) {
        // Validate thời gian
        if (lopDoAnDTO.getThoiGianKetThuc() != null && 
            lopDoAnDTO.getThoiGianBatDau() != null && 
            lopDoAnDTO.getThoiGianKetThuc().isBefore(lopDoAnDTO.getThoiGianBatDau())) {
            throw new RuntimeException("Thời gian kết thúc phải sau thời gian bắt đầu");
        }

        LopDoAn lopDoAn = new LopDoAn();
        lopDoAn.setTenLopDoAn(lopDoAnDTO.getTenLopDoAn());
        String maThamGia = UUID.randomUUID().toString().replace("-", "").substring(0, 10); // 10 ký tự
        lopDoAn.setMaThamGia(maThamGia);
        lopDoAn.setGhiChu(lopDoAnDTO.getGhiChu());
        lopDoAn.setGvId(lopDoAnDTO.getGvId());
        lopDoAn.setThoiGianBatDau(lopDoAnDTO.getThoiGianBatDau());
        lopDoAn.setThoiGianKetThuc(lopDoAnDTO.getThoiGianKetThuc());
        LopDoAn savedLopDoAn = lopDoAnRepository.save(lopDoAn);
        
        return convertToDTO(savedLopDoAn);
    }

    @Transactional
    public void deleteLopDoAn(Integer maLopDoAn) {
        if (!lopDoAnRepository.existsByMaLopDoAn(maLopDoAn)) {
            throw new RuntimeException("Không tìm thấy lớp đồ án với mã " + maLopDoAn);
        }
        lopDoAnRepository.deleteById(maLopDoAn);
    }

    private LopDoAnDTO convertToDTO(LopDoAn lopDoAn) {
        return new LopDoAnDTO(
            lopDoAn.getMaLopDoAn(),
            lopDoAn.getTenLopDoAn(),
            lopDoAn.getMaThamGia(),
            lopDoAn.getGhiChu(),
            lopDoAn.getGvId(),
            lopDoAn.getThoiGianBatDau(),
            lopDoAn.getThoiGianKetThuc()
        );
    }

    public List<LopDoAnDTO> getLopDoAnByGvId(String gvId) {
        List<LopDoAn> lopDoAnList = lopDoAnRepository.findByGvId(gvId);
        List<LopDoAnDTO> lopDoAnDTOs = new ArrayList<>();
        for (LopDoAn lopDoAn : lopDoAnList) {
            LopDoAnDTO dto = new LopDoAnDTO(
                lopDoAn.getMaLopDoAn(),
                lopDoAn.getTenLopDoAn(),
                lopDoAn.getMaThamGia(),
                lopDoAn.getGhiChu(),
                lopDoAn.getGvId(),
                lopDoAn.getThoiGianBatDau(),
                lopDoAn.getThoiGianKetThuc()
            );
            lopDoAnDTOs.add(dto);
        }
        return lopDoAnDTOs;
    }

    public LopDoAnDTO getLopDoAnByMaLopDoAn(Integer maLopDoAn) {
        LopDoAn lopDoAn = lopDoAnRepository.findById(maLopDoAn)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp đồ án với mã " + maLopDoAn));
        return convertToDTO(lopDoAn);
    }
    public List<LopDoAnDTO> getSSByUser(String id){
        List<LopDoAn> ds = lopDoAnRepository.findAllLopDoAnByNguoiDungId(id);
        List<LopDoAnDTO > lopDoAnDTOS = new ArrayList<>();
        for (LopDoAn s : ds) {
            LopDoAnDTO dto = new LopDoAnDTO();
            dto.setMaLopDoAn(s.getMaLopDoAn());
            dto.setTenLopDoAn(s.getTenLopDoAn());
            dto.setGhiChu(s.getGhiChu());
            dto.setGvId(s.getGvId());
            dto.setThoiGianBatDau(s.getThoiGianBatDau());
            dto.setThoiGianKetThuc(s.getThoiGianKetThuc());
            dto.setMaThamGia(s.getMaThamGia());
            lopDoAnDTOS.add(dto);
        }

        return lopDoAnDTOS;
    }

} 