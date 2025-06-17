package com.stu.attendance.service;

import com.stu.attendance.entity.*;
import com.stu.attendance.repository.LopDoAnRepository;
import com.stu.attendance.repository.ThamGiaLopDoAnRepository;
import com.stu.attendance.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ThamGiaLopDoAnService {
    private final ThamGiaLopDoAnRepository thamGiaLopDoAnRepository;
    private final UserRepository userRepository;
    private final LopDoAnRepository lopDoAnRepository;

    @Transactional
    public void addStudentdoan(String userId, String maThamGia) {
        ThamGiaLopDoAn thamGiaLopDoAn = new ThamGiaLopDoAn();
        NguoiDung nguoiDung = userRepository.findByMaNguoiDung(userId).get();
        LopDoAn lopDoAn = lopDoAnRepository.findByMaThamGia(maThamGia);

        if(!userRepository.findByMaNguoiDung(userId).isPresent() || lopDoAn == null){
            return;
        }

        thamGiaLopDoAn.setNguoiDung(nguoiDung);
        thamGiaLopDoAn.setLopDoAn(lopDoAn);
        thamGiaLopDoAnRepository.save(thamGiaLopDoAn);

    }


} 