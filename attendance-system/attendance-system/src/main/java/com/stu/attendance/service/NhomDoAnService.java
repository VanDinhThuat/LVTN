package com.stu.attendance.service;

import com.stu.attendance.dto.NhomDoAnDTO;
import com.stu.attendance.entity.LopDoAn;
import com.stu.attendance.entity.NhomDoAn;
import com.stu.attendance.repository.LopDoAnRepository;
import com.stu.attendance.repository.NhomDoAnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NhomDoAnService {
    
    private final NhomDoAnRepository nhomDoAnRepository;
    private final LopDoAnRepository lopDoAnRepository;

    @Transactional
    public NhomDoAnDTO addNhomDoAn(NhomDoAnDTO nhomDoAnDTO) {
        // Validate if maNhom already exists
        if (nhomDoAnRepository.existsByMaNhom(nhomDoAnDTO.getMaNhom())) {
            throw new RuntimeException("Mã nhóm đã tồn tại");
        }

        // Validate if LopDoAn exists
        LopDoAn lopDoAn = lopDoAnRepository.findById(Integer.parseInt(nhomDoAnDTO.getMaLopDoAn()))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp đồ án"));

        NhomDoAn nhomDoAn = new NhomDoAn();
        nhomDoAn.setMaNhom(nhomDoAnDTO.getMaNhom());
        nhomDoAn.setTenNhom(nhomDoAnDTO.getTenNhom());
        nhomDoAn.setLopDoAn(lopDoAn);
        nhomDoAn.setGhiChu(nhomDoAnDTO.getGhiChu());

        NhomDoAn savedNhomDoAn = nhomDoAnRepository.save(nhomDoAn);
        return convertToDTO(savedNhomDoAn);
    }

    @Transactional
    public NhomDoAnDTO updateNhomDoAn(Integer maNhom, NhomDoAnDTO nhomDoAnDTO) {
        NhomDoAn nhomDoAn = nhomDoAnRepository.findById(maNhom)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm đồ án"));

        // Validate if LopDoAn exists
        LopDoAn lopDoAn = lopDoAnRepository.findById(Integer.parseInt(nhomDoAnDTO.getMaLopDoAn()))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp đồ án"));

        nhomDoAn.setTenNhom(nhomDoAnDTO.getTenNhom());
        nhomDoAn.setLopDoAn(lopDoAn);
        nhomDoAn.setGhiChu(nhomDoAnDTO.getGhiChu());

        NhomDoAn updatedNhomDoAn = nhomDoAnRepository.save(nhomDoAn);
        return convertToDTO(updatedNhomDoAn);
    }

    public List<NhomDoAnDTO> getAllNhomDoAn() {
        return nhomDoAnRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public NhomDoAnDTO getNhomDoAnById(Integer maNhom) {
        NhomDoAn nhomDoAn = nhomDoAnRepository.findById(maNhom)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm đồ án"));
        return convertToDTO(nhomDoAn);
    }

    public List<NhomDoAnDTO> getNhomDoAnByLopDoAn(Integer maLopDoAn) {
        return nhomDoAnRepository.findByLopDoAn_MaLopDoAn(maLopDoAn).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteNhomDoAn(Integer maNhom) {
        if (!nhomDoAnRepository.existsById(maNhom)) {
            throw new RuntimeException("Không tìm thấy nhóm đồ án");
        }
        nhomDoAnRepository.deleteById(maNhom);
    }

    private NhomDoAnDTO convertToDTO(NhomDoAn nhomDoAn) {
        return new NhomDoAnDTO(
            nhomDoAn.getMaNhom(),
            nhomDoAn.getTenNhom(),
            nhomDoAn.getLopDoAn().getMaLopDoAn().toString(),
            nhomDoAn.getGhiChu()
        );
    }
} 